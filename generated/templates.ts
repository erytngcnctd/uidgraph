// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import { DataSourceTemplate, DataSourceContext } from "@graphprotocol/graph-ts";

export class TokenMetaData extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("TokenMetaData", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("TokenMetaData", [cid], context);
  }
}

export class UidMetaData extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("UidMetaData", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("UidMetaData", [cid], context);
  }
}