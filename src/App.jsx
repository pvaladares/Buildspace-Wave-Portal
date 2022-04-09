import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {

  const contractABI = abi.abi;
	const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [tweetValue, setTweetValue] = React.useState("")
  /*
   * The address of the contract was deployed to blockchain (and by the way, verified!)
   */	
  const contractAddress = '0x71f3741db7358afb42e21BFA69c0142259E7d827';

  /*
   * If wallet is connected, the ethereum object is created/found
   * A debug message is shown
   */
	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;
      
			if (!ethereum) {
				console.log('Make sure you have metamask!');
				return;
			} 
      else {
				console.log('We have the ethereum object', ethereum);
			}
      
      /*
       * Check if we're authorized to access the user's wallet
       */
			const accounts = await ethereum.request({ method: 'eth_accounts' });

      // If metamask account is found, take the first account (index 0)
			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log('Found an authorized account:', account);
				setCurrentAccount(account);
			} 
      else {
				console.log('No authorized account found');
			}
		} 
    catch (error) {
			console.log(error);
		}
	};
  
  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from the Smart Contract deployed
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  /* 
   * Check if metamask is installed or enabled on browswer
   */
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

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
  //  setLoadingFlag(1);
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

        const waveTxn = await wavePortalContract.wave(message.value)
				console.log('Mining...', waveTxn.hash);

				await waveTxn.wait();
				console.log('Mined -- ', waveTxn.hash);

				count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());

			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
    getAllWaves();
	}, []);

	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">👋 Hi there!</div>

				<div className="bio">
					I am a Pedro, 👷🔩 turned a dev, now experimenting solidity Smart
					Contracts and making my way to the new world of decentralized <b>Web3</b>! 💻<p>
						Just give it a try, <b>connect your Wallet</b> and <b>send a message! 👋</b>
					</p>
				</div>

        {currentAccount && (
        <div className="myText">
          Type a message below:<br></br>
          <input type="text" id="message" name="message" ></input>
        </div>
        )}

        {currentAccount && (
				<button className="waveButton" onClick={wave}>
					Send message! 👋 
				</button>
        )}
      
				{!currentAccount && (
					<button className="waveButton" onClick={connectWallet}>
						🔗 Connect Wallet
					</button>
        )}
        

				
        
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
};

export default App;
