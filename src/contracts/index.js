// Copyright (C) 2020 Zilliqa

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https:www.gnu.org/licenses/>.

import auction from '!raw-loader!./auction.scilla';
import bookstore from '!raw-loader!./bookstore.scilla';
import crowdfunding from '!raw-loader!./crowdfunding.scilla';
import ecdsa from '!raw-loader!./ecdsa.scilla';
import fungibleToken from '!raw-loader!./fungible_token.scilla';
import helloWorld from '!raw-loader!./hello_world.scilla';
import nonFungibleToken from '!raw-loader!./nonfungible_token.scilla';
import schnorr from '!raw-loader!./schnorr.scilla';
import zilGame from '!raw-loader!./zil_hash_game.scilla';
import asciiart from '!raw-loader!./asciiart.scilla';

export const defaultFiles = [
  { id: 'hello-world', name: 'HelloWorld', code: helloWorld, ext: 'scilla' },
  { id: 'book-store', name: 'BookStore', code: bookstore, ext: 'scilla' },
  { id: 'crowd-funding', name: 'CrowdFunding', code: crowdfunding, ext: 'scilla' },
  { id: 'auction', name: 'Auction', code: auction, ext: 'scilla' },
  { id: 'fungible-token', name: 'FungibleToken', code: fungibleToken, ext: 'scilla' },
  { id: 'non-fungible', name: 'NonFungible', code: nonFungibleToken, ext: 'scilla' },
  { id: 'zil-game', name: 'ZilGame', code: zilGame, ext: 'scilla' },
  { id: 'schnorr-test', name: 'SchnorrTest', code: schnorr, ext: 'scilla' },
  { id: 'ecdsa-test', name: 'ECDSATest', code: ecdsa, ext: 'scilla' },
  { id: 'asciiart', name: 'AsciiArt', code: asciiart, ext: 'scilla' }
];
