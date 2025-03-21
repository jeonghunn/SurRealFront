import { DateTime } from 'luxon';

export enum Gender {
  ALL,
  MALE ,
  FEMALE,
}

export enum WindowSizeWidth {
  MOBILE = 700,
}

export enum ChatSpaceCategory {
  ROOM,
  CHAT,
  LIVE,
  INFO,
}

export enum LiveCategory {
  NOW,
  SUMMARY,
  MAP,
  ATTENDEE,
  ATTACH,
}

export enum CommunicationType {
  AUTH,
  CHAT,
  LIVE,
}

export enum SpaceActionType {
  INSERT,
  UPDATE,
  DELETE,
}

export enum ResponseResult {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class UserSimpleSet {
  public id: number;
  public token: string;
}

export class User {
  public id: number;
  public email_host?: string;
  public email_name?: string;
  public name?: string;
  public color?: string;
  public last_name?: string;
  public relation?: Relation;
}

export class Relation {
  public id: number;
  public category: RelationCategory;
  public status: RelationStatus;
  public target?: User;
  public user_id: number;
  public target_id: number;
}



export class Communication {
  public T: CommunicationType;
  public createdAt?: string;

  public constructor(
    type: CommunicationType,
    createdAt: string,
  ) {
    this.T = type;
    this.createdAt = createdAt;
  }
}

export class CommunicationResult extends Communication {

  public result?: boolean;
  public message?: string;

  public constructor(
    type: CommunicationType,
    isSuccess: boolean,
    message: string,
    date: DateTime,
  ) {
    super(type, date);
    this.result = isSuccess;
    this.message = message;
  }

}

export class Chat extends Communication {

  public id?: string;
  public content: string;
  public user?: User;
  public topic_id?: string;
  public meta?: any;
  public category?: ChatCategory;
  public ticket_id: string;

  public constructor(
    id: string,
    category: ChatCategory,
    content: string,
    createdAt: string,
    user: User,
    topicId: string = null,
    meta: any = null,
  ) {
    super(CommunicationType.CHAT, createdAt);
    this.id = id;
    this.category = category;
    this.content = content;
    this.user = user;
    this.topic_id = topicId;
    this.meta = meta;
  }

}

export class AuthMessage extends Communication {

  public token?: string;
  public constructor(
    token: string,
  ) {
    super(CommunicationType.AUTH, null);
    this.token = token;
  }
}

export class LiveMessage extends Communication {

  public content?: any;

  public B: any;

  public constructor(
    content: any,
    user_id: number = null,
  ) {
    super(CommunicationType.LIVE, null);
    this.content = content;
  }
}

export class Marker {
  public title: string;
  public lat: number;
  public lng: number;

  public constructor(title: string, lat: number, lng: number) {
    this.title = title;
    this.lat = lat;
    this.lng = lng;
  }
}


export class SpaceAction {
  public type: SpaceActionType;
  public content: SpaceItem;
}

export class SpaceItem {
  public id: string;
  public index: number;
  public data: any;
}

export class Group {
  public id: string;
  public name: string;
  public user_id: number;
  public target_id: number;
  public target?: User;
}

export class Room {
  public id: number;
  public name: string;
  public description: string;
  public user?: User;
  public group: Group;
  public group_id?: string;
  public letter: string;
  public online_count: number;
  public limit: number;
  public status: number;

}

export class Topic {
  public id: string;
  public name: string;
  public category: string;
  public parent_id: number;
  public chat_id: string;
  public chat?: Chat;
  public user_id: number;
  public created_at: string;
  public updated_at: string;
  public space?: any;
}

export class FileContainer {
  public file: File;
  public url: any;
}

export enum RelationCategory {
  FRIEND,
  BLOCKED,
}

export enum RelationStatus {
  NORMAL,
  REMOVED,
  PENDING,
  REQUEST_RECEIVED,
}

export enum AttachType {
  BINARY,
  IMAGE,
  VIDEO,
}

export enum AttachStatus {
  NORMAL,
  PROCESSING,
  REMOVED,
  UNPROCESSED,
}

export enum ChatCategory {
  MESSAGE,
  TOPIC_PREVIEW,
}

export class ResponseSet {
  public category: ResponseResult;
  public message: string;
  public description: string;
}

export class Attach {
  id: number;
  name: string;
  extension: string;
  binary_name: string;
  mimetype: string;
  type: number;
  size: number;
  urls: any;
  status: AttachStatus;
}
