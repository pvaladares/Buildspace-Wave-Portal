import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const contractABI = abi.abi;
  // Variable with the total of waves done so far
  const [allWaves, setAllWaves] = useState(0);
  // Variable to handle the UI animation while querying blockchain
	const [loadingFlag, setLoadingFlag] = useState(0);
  // The address of the contract that I deployed
	const contractAddress = '0x08192f64a523AFfa657c558f6F1a552469a3DAeA';

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log('Make sure you have metamask!');
				return;
			} else {
				console.log('We have the ethereum object', ethereum);
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' });

      // If metamask accont is found, take the first account (index 0)
			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log('Found an authorized account:', account);
				setCurrentAccount(account);
			} else {
				console.log('No authorized account found');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

      // Check if metamask is installed or enabled on browswer
			if (!ethereum) {
				alert('Get MetaMask!');
				return;
			}

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});

			console.log('Connected', accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const wave = async () => {
    
    // Start animation
    setLoadingFlag(1);
		try {
      const { ethereum } = window;

			if (ethereum) {

				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());
        // Update counter UI
				setAllWaves(count.toNumber());

				const waveTxn = await wavePortalContract.wave();
				console.log('Mining...', waveTxn.hash);

				await waveTxn.wait();
				console.log('Mined -- ', waveTxn.hash);

				count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());

				// Update counter UI
				setAllWaves(count.toNumber());
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
    // Stop animation
    setLoadingFlag(0);
	};

	const readCurrentWaves = async () => {
    // Start animation
		setLoadingFlag(1);
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());
        // Update counter UI
				setAllWaves(count.toNumber());
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
    // Stop animation
    setLoadingFlag(0);
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">👋 Hi there!</div>

				<div className="bio">
					I am a Mechanical Engineer 👷🔩 turned a dev, now experimenting Smart
					Contracts and making my way to the new world of <b>Web3</b>! 💻<p>
						Just give it a try, <b>connect your Wallet</b> and{' '}
						<b>just 👋 wave!</b>
					</p>
				</div>

				<button className="waveButton" onClick={wave}>
					👋 Wave at Me
				</button>

				{!currentAccount && (
					<button className="waveButton" onClick={connectWallet}>
						🔗 Connect Wallet
					</button>
				)}

				<div className="myText" onClick={readCurrentWaves}>
					Total Waves : {allWaves}
        </div>
        <p></p>
				<div className="invisibleText">
					{loadingFlag && (
						<img
							src="https://i.gifer.com/7YUL.gif"
							alt="Loading..."
							width="20%"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default App;
