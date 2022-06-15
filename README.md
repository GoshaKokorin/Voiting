# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

```tasks
addVoting             Create voting
finishVoting          Finish voting
run test              Generates a code coverage report for tests
test                  Runs mocha tests
viewAmountVotes       View the number of votes for the selected candidate
viewCandidates        View candidates in the selected voting
viewWhoVoted          Find out whether a member voted or not
vote                  Vote for a candidate
withdraw              Withdraw commission
```