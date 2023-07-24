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
  TokenMetaData
} from "../generated/schema"
import { json, Bytes, dataSource, log } from "@graphprotocol/graph-ts"
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

  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePermanentURI(event: PermanentURIEvent): void {
  let entity = new PermanentURI(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.value = event.params._value
  entity.tokenId = event.params._id

  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

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

  transfer.blockNumber = event.block.number
  transfer.timestamp = event.block.timestamp
  transfer.transactionHash = event.transaction.hash

  transfer.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let transfer = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  // let asset = URI.load(event.params._id)
  // if (asset === null) asset = new URI(event.params._id)

  // if (event.params._to.toHexString() == '0x84398272c77a35e765eff8fcb95af3bf941581a5') {

  //   if (asset.available !== null) asset.available -= new BigInt(event.params._value)
  //   asset.save()
  // }

  // if (event.params._from.toHexString() == '0x0000000000000000000000000000000000000000') {
  //   asset.available = event.params._value
  //   asset.save() 
  // }

  transfer.value = event.params._value
  transfer.operator = event.params._operator
  transfer.from = event.params._from
  transfer.to = event.params._to
  transfer.tokenId = event.params._id

  transfer.blockNumber = event.block.number
  transfer.timestamp = event.block.timestamp
  transfer.transactionHash = event.transaction.hash

  transfer.save()
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
  let entity = URI.load(event.params._tokenId.toString())
  if (entity == null) {
    entity = new URI(event.params._tokenId.toString())
  }
  let hash = ''
  if (event.params._value.substring(5,7) == '//') {
    hash = event.params._value.split("//")[1]
  }
  entity.tokenMetaData = hash
  entity.metaDataUri = hash
  entity.from = event.transaction.from
  let tokenMetaData = TokenMetaData.load(hash)
  if (tokenMetaData == null && hash != '') {
    TokenMetaDataTemplate.create(hash)
  }
  entity.tokenId = event.params._tokenId
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}
