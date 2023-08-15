import { idLog as idLogEvent } from "../generated/ungrundid/ungrundid"
import { ungrundId, UidMetaData} from "../generated/schema"
import { json, Bytes, dataSource} from "@graphprotocol/graph-ts"
import {
  UidMetaData as UidMetaDataTemplate
  } from '../generated/templates'
  
export function handleidLog(event: idLogEvent): void {
  let ungrundid = new ungrundId(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  const hash = event.params._metadata.split("//")[1]
  ungrundid.uidMetaData = hash
  ungrundid.metaDataUri = hash
  UidMetaDataTemplate.create(hash)
  ungrundid.ungrundId = event.params._subjkt

  ungrundid.block = event.block.number
  ungrundid.timestamp = event.block.timestamp
  ungrundid.hash = event.transaction.hash

  ungrundid.save()
}

export function handleUidMetaData(content: Bytes): void {
  let metaData = new UidMetaData(dataSource.stringParam())
  const value = json.fromBytes(content).toObject()
  if (value) {
    const description = value.get('description')
    const image = value.get('image')
    if (description) metaData.description = description.toString()
    if (image) metaData.image = image.toString()
  }
  metaData.save()
 }
