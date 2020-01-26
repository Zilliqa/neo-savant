import auction from '!raw-loader!./auction.scilla';
import bookstore from '!raw-loader!./bookstore.scilla';
import crowdfunding from '!raw-loader!./crowdfunding.scilla';
import ecdsa from '!raw-loader!./ecdsa.scilla';
import fungibleToken from '!raw-loader!./fungible_token.scilla';
import helloWorld from '!raw-loader!./hello_world.scilla';
import nonFungibleToken from '!raw-loader!./nonfungible_token.scilla';
import schnorr from '!raw-loader!./schnorr.scilla';
import zilGame from '!raw-loader!./zil_hash_game.scilla';

export const defaultFiles = [
  { id:'hello-world', name: 'HelloWorld', code: helloWorld },
  { id: 'book-store', name: 'BookStore', code: bookstore },
  { id: 'crowd-funding', name: 'CrowdFunding', code: crowdfunding },
  { id: 'auction', name: 'Auction', code: auction },
  { id: 'fungible-token', name: 'FungibleToken', code: fungibleToken },
  { id: 'non-fungible', name: 'NonFungible', code: nonFungibleToken },
  { id: 'zil-game', name: 'ZilGame', code: zilGame },
  { id: 'schnorr-test', name: 'SchnorrTest', code: schnorr },
  { id: 'ecdsa-test', name: 'ECDSATest', code: ecdsa },
];
