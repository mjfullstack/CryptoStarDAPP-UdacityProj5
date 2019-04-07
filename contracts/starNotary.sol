pragma solidity >=0.4.24;

//Importing openzeppelin-solidity ERC-721 implemented Standard
// import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Star data
    struct Star {
        string name;
    }

// Add a name and a symbol for your starNotary tokens
    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    // Much more detailed approach for ERC721 at: 
    // contract ERC721Metadata is ERC165, ERC721, IERC721Metadata {...
    // https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Metadata.sol
    // BUT FOR THIS EXERCISE: It appears public vars is sufficient and intended for the exercise.
    // ERC721 Non-Fungible Token Standard
    string public tokenName   = "CryptoStarToken";
    string public tokenSymbol = "CST";
    // uint public decimals = 1; // No sub-division of non-fungible tokens
    // uint public INITIAL_SUPPLY = 10000 // There is LOTS more stars than this!!!
    // uint public INITIAL_SUPPLY = 1000 * Math.pow(10, 9) ); // For decimals of 9 for fungible tokens
    // End of Added Name and Symbbol Project 5 Code


    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;


    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        // Puts tokenID on chain (???) with address of creator / owner
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
        starsForSale[_tokenId] = _price;
    }


    // Function that allows you to convert an address into a payable address
    // Added from ZIP version of starter code
    function _make_payable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

/************ Superceded by function below ***************
    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);
        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        starOwner.transfer(starCost);
        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
      }
************ Superceded by function below ***************/

    // From ZIP form of starter code... notably different than that above.
    function buyStar(uint256 _tokenId) public  payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        _transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    // function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
    // 1. You should return the Star saved in tokenIdToStarInfo mapping
    // Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns (string memory) {
        return tokenIdToStarInfo[_tokenId].name;
    }
    //


    // Implement Task 1 Exchange Stars function
    // function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
    // Add a function called exchangeStars, so 2 users can exchange their star tokens...
    // Do not worry about the price, just write code to exchange stars between users.
    function exchangeStars( uint256 _tokenId_1, uint256 _tokenId_2)  public returns (address)  {
        // 1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        // MUST be one of the owner's requesting this exchange...
        require( ( ownerOf( _tokenId_1 ) == msg.sender ) || ( ownerOf( _tokenId_2 ) == msg.sender ) );

        // 2. You don't have to check for the price of the token (star)
        // require(starsForSale[_tokenId_1 ] > 0);             // Each star must be available; Required ???
        // require(starsForSale[_tokenId_2 ] > 0);             // Each star must be available; Required ???

        // 3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId1)
        address tempAddr_1 = ownerOf( _tokenId_1 ); // Exchange requires saving 1 item temporarily
        address tempAddr_2 = ownerOf( _tokenId_2 ); // Save 2nd address for check/final require stmt

        // 4. Use _transferFrom function to exchange the tokens.
        // Order Of Arguments: _transferFrom( FROM_Addr, TO_Addr, _tokenId);
        _transferFrom( tempAddr_1, tempAddr_2, _tokenId_1);
        _transferFrom( tempAddr_2, tempAddr_1, _tokenId_2);

        require( ownerOf( _tokenId_2 ) == tempAddr_1 );
        require( ownerOf( _tokenId_1 ) == tempAddr_2 );
        return msg.sender; // Object vs. Address...
    }
    //

    // Implement Task 1 Transfer Stars
    // function transferStar(address _to1, uint256 _tokenId) public {
    // Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
        // The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
    function transferStar(address _toAddr, uint256 _tokenId) public returns (address)  {
        // 1. Check if the sender is the ownerOf(_tokenId)
        require( ownerOf(_tokenId) == msg.sender, 'Sender must be owner');
        // 2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        _transferFrom( msg.sender, _toAddr, _tokenId);  // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        require (ownerOf(_tokenId) ==_toAddr );         // If trasnfer not successful, revert via require.
        return (ownerOf(_tokenId) );                    // Return the star's new owner address
    }
    //

}
