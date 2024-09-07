# Required Technology
- Redis
- Postgres

# Steps to run locally
 - npm i 
 - npm run start:dev

# Api Doc (Swagger) 
  endpoint: http://${baseUrl}/api/v1/




# Additional Resources
  Here are some of the features added to the basic requirement:

  - Wallet: Need to new create wallet or use existing wallet , provides baseline for security using web3 wallet encryption.
  
  - Security with Auth: After setting up wallet with the system ,users can login with thier passphrase so that on subsequent requests they wont need to pass in thier privatekey to send transactions. 

  - Encrypted Transaction: After Initial wallet setup no privatekey is needed to send transaction and accounts saved on the system are encrypted.



# Api Walkthrough

- ## Test Feature Without Wallet Setup 
  
    You can interact with the system without setting up a wallet

    Send Transaction (Here you need to pass in a private key)
    http://${baseUrl}/api/v1/transactions

- ## Test Features Wallet Setup 
    -  Setup of wallet  new or exisiting
        New:http://${baseUrl}/api/v1/wallets/create-new-wallet
        Exisiting:http://${baseUrl}/api/v1/wallets/setup-exisitng-wallet
    
    - After setup the system logins your wallet in automatically
    - If session expires you can login with your passphrase 
        endpoint: http://${baseUrl}/api/v1/authentication/
    
    - Send Transaction
      endpoint: http://${baseUrl}/api/v1/transactions/with-private-key-encryption
      you need to be authorized/logged in to use this endpoint.


# Test coverage
 - npm run test:cov





