import {
  ApprovalForAll as ApprovalForAllEvent,
  PermanentURI as PermanentURIEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent
} from "../generated/Contract/Contract"
import {
  ApprovalForAll,
  PermanentURI,
  TransferBatch,
  Transfer,
  URI, 
  TokenMetaData,
  Holder,
  Token
} from "../generated/schema"
import { json, Bytes, dataSource, log } from "@graphprotocol/graph-ts"
import { BigInt } from '@graphprotocol/graph-ts'
import {
  TokenMetaData as TokenMetaDataTemplate
  } from '../generated/templates'

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params._owner
  entity.operator = event.params._operator
  entity.approved = event.params._approved

  entity.block = event.block.number
  entity.timestamp = event.block.timestamp
  entity.hash = event.transaction.hash

  entity.save()
}

export function handlePermanentURI(event: PermanentURIEvent): void {
  let entity = new PermanentURI(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.value = event.params._value
  entity.tokenId = event.params._id

  entity.block = event.block.number
  entity.timestamp = event.block.timestamp
  entity.hash = event.transaction.hash

  entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let transfer = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  transfer.operator = event.params._operator
  transfer.from = event.params._from
  transfer.to = event.params._to
  transfer.tokenIds = event.params._ids
  transfer.values = event.params._values

  transfer.block = event.block.number
  transfer.timestamp = event.block.timestamp
  transfer.hash = event.transaction.hash

  transfer.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let transfer = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  let to =  event.params._to
  let from =  event.params._from
  let tokenId = event.params._id
  let amount = event.params._value
  let block = event.block.number
  let timestamp = event.block.timestamp
  let hash = event.block.hash

  let toId = (tokenId.toString() + "-" + to.toHexString())
  let fromId = (tokenId.toString() + "-" + from.toHexString())
  
  let asset = Token.load(tokenId.toString())

  if (!asset) {
    asset = new Token(tokenId.toString())
    asset.creator = to
    asset.block = block
    asset.timestamp = timestamp
    asset.hash = hash
    asset.editions = amount
    asset.save()
  }
  
  if (to.toHexString() == '0x84398272c77a35e765eff8fcb95af3bf941581a5' && asset.editions !== null) {
    asset.editions.minus(amount)
    asset.save()
  } 

  transfer.value = amount
  transfer.operator = event.params._operator
  transfer.from = from
  transfer.to = to
  transfer.tokenId = tokenId

  transfer.block = block
  transfer.timestamp = timestamp
  transfer.hash = hash

  transfer.save()

  let holder_to = Holder.load(toId)
  if (holder_to == null) {
    holder_to = new Holder(toId);
    holder_to.tokenId = tokenId;
    holder_to.address = to;
    holder_to.amount = BigInt.fromI32(0);
    holder_to.timestamp = timestamp;
  }
  holder_to.timestamp = timestamp;
  holder_to.amount = holder_to.amount.plus(amount)
  holder_to.save()
  
  let holder_from= Holder.load(fromId)
  if (holder_from) {
    holder_from.amount = holder_from.amount.minus(amount)
    holder_from.timestamp = timestamp;
    holder_from.save()
  }
}

export function handleTokenMetaData(content: Bytes): void {
  let metaData = new TokenMetaData(dataSource.stringParam())
  const value = json.fromBytes(content).toObject()
  if (value) {
    const name = value.get('name')
    const description = value.get('description')
    const image = value.get('image')
    const animation = value.get('animation_url')
    const mimeType = value.get('mimeType')
    if (name)  metaData.name = name.toString()
    if (description) metaData.description = description.toString()
    if (image) metaData.image = image.toString()
    if (animation) metaData.animation_url = animation.toString()
    if (mimeType) metaData.mimeType = mimeType.toString()
  }
  metaData.save()
 }

export function handleURI(event: URIEvent): void {
  let tokenId = event.params._tokenId
  let block = event.block.number
  let timestamp = event.block.timestamp
  let hash = event.block.hash
  let uri = new URI(event.transaction.hash.concatI32(event.logIndex.toI32()))

  let ipfs = ''
  if (event.params._value.substring(5,7) == '//') {
    ipfs = event.params._value.split("//")[1]
  }
  uri.tokenId = tokenId
  uri.tokenMetaData = ipfs
  uri.metaDataUri = ipfs
  uri.from = event.transaction.from
  
  let token = Token.load(tokenId.toString())
  if (token){
    token.metaDataUri = ipfs
    token.tokenMetaData = ipfs
    token.save()
  }
  let tokenMetaData = TokenMetaData.load(ipfs)
  
  if (tokenMetaData == null && ipfs != '') {
    TokenMetaDataTemplate.create(ipfs)
  }

  uri.block = block
  uri.timestamp = timestamp
  uri.hash = hash
  uri.save()
}
