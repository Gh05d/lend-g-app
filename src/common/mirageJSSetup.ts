import {
  createServer,
  Factory,
  Model,
  belongsTo,
  hasMany,
  Response,
} from "miragejs";
import {fakerDE as faker} from "@faker-js/faker";
import {ModelDefinition, Registry} from "miragejs/-types";
import Schema from "miragejs/orm/schema";
import {randomIntFromInterval} from "./functions";
import {PublicKey} from "@solana/web3.js";

const ChatModel: ModelDefinition<Chat> = Model.extend({messages: hasMany()});
const MessageModel: ModelDefinition<Message> = Model.extend({
  chat: belongsTo(),
});
const UserModel: ModelDefinition<User> = Model.extend({
  items: hasMany(),
  requests: hasMany(),
});

type AppRegistry = Registry<
  {
    chat: typeof ChatModel;
    message: typeof MessageModel;
    item: typeof Model;
    request: typeof Model;
    user: typeof UserModel;
  },
  {}
>;

type AppSchema = Schema<AppRegistry>;

if (globalThis.server) {
  globalThis.server.shutdown();
}

globalThis.server = createServer({
  models: {
    chat: ChatModel,
    message: MessageModel,
    item: Model,
    request: Model,
    user: UserModel,
  },

  factories: {
    user: Factory.extend({
      id() {
        return faker.string.uuid();
      },
      firstName() {
        return faker.person.firstName();
      },
      lastName() {
        return faker.person.lastName();
      },
      gender() {
        return faker.person.sex();
      },
      email() {
        return faker.internet.email();
      },
      phone() {
        return faker.phone.number();
      },
      userName() {
        return faker.internet.username();
      },
      password() {
        return faker.internet.password();
      },
      birthDate() {
        return faker.date
          .birthdate({min: 18, max: 65, mode: "age"})
          .toISOString()
          .split("T")[0];
      },
      profilePicture() {
        return faker.image.avatar();
      },
    }),

    chat: Factory.extend({
      ownerID() {
        return faker.string.uuid();
      },
      userID() {
        return faker.string.uuid();
      },
      createdAt() {
        return faker.date.past().toISOString();
      },
    }),

    message: Factory.extend({
      chatID() {
        return faker.string.uuid();
      },
      ownerID() {
        return faker.string.uuid();
      },
      text() {
        return faker.lorem.sentence();
      },
      timestamp() {
        return faker.date.recent().toISOString();
      },
      read: null,
    }),

    item: Factory.extend({
      id() {
        return faker.string.uuid();
      },
      title() {
        return faker.commerce.productName();
      },
      category() {
        return faker.commerce.product();
      },
      price() {
        return faker.commerce.price({min: 15, max: 400, dec: 0, symbol: "€"});
      },
      description() {
        return faker.commerce.productDescription();
      },
      image() {
        return faker.image.urlPicsumPhotos();
      },
      userID() {
        return faker.string.uuid();
      },
      currentlyRentedBy() {
        return null;
      },
      pastRentals() {
        return [];
      },
    }),

    request: Factory.extend({
      id() {
        return faker.string.uuid();
      },
      ownerID() {
        return faker.string.uuid();
      },
      requesterID() {
        return faker.string.uuid();
      },
      itemID() {
        return faker.string.uuid();
      },
      price() {
        return faker.commerce.price({min: 10, max: 50, dec: 0, symbol: "€"});
      },
      timeFrame() {
        return {
          startDate: faker.date.soon().toISOString().split("T")[0],
          endDate: faker.date
            .soon({days: randomIntFromInterval(2, 15)})
            .toISOString()
            .split("T")[0],
        };
      },
      status() {
        return faker.helpers.arrayElement(["open", "accepted", "denied"]);
      },
    }),
  },

  seeds(server) {
    const user1 = server.create("user");
    const user2 = server.create("user");
    const user3 = server.create("user");
    const user4 = server.create("user");
    server.create("user");

    server.createList("user", 15);

    const chat1 = server.create("chat", {ownerID: user1.id, userID: user2.id});
    server.create("message", {
      chatID: chat1.id,
      ownerID: user2.id,
      read: faker.date.recent().toISOString(),
    });
    server.create("message", {
      chatID: chat1.id,
      ownerID: user2.id,
      read: faker.date.recent().toISOString(),
    });
    server.create("message", {
      chatID: chat1.id,
      ownerID: user1.id,
      read: faker.date.recent().toISOString(),
    });
    server.create("message", {chatID: chat1.id, ownerID: user2.id});

    const chat2 = server.create("chat", {
      ownerID: user1.id,
      userID: user3.id,
    });
    server.create("message", {
      chatID: chat2.id,
      ownerID: user3.id,
      read: faker.date.recent().toISOString(),
    });
    server.create("message", {
      chatID: chat2.id,
      ownerID: user3.id,
      read: faker.date.recent().toISOString(),
    });
    server.create("message", {chatID: chat2.id, ownerID: user1.id});

    const chat3 = server.create("chat", {ownerID: user4.id, userID: user4.id});
    server.createList("message", 5, {chatID: chat3.id});

    const listData = server.createList("item", 4, {userID: user1.id});
    const listData2 = server.createList("item", 6, {userID: user2.id});
    const listData3 = server.createList("item", 8, {userID: user3.id});

    server.createList("request", 2, {
      ownerID: user1.id,
      itemID: listData[randomIntFromInterval(0, 3)].id,
      requesterID: user2.id,
      status: "open",
    });

    server.createList("request", 5, {
      ownerID: user1.id,
      itemID: listData[randomIntFromInterval(0, 3)].id,
      requesterID: user2.id,
    });
    server.createList("request", 2, {
      ownerID: user3.id,
      requesterID: user4.id,
      itemID: listData3[randomIntFromInterval(0, 7)].id,
      status: "open",
    });
    server.createList("request", 3, {
      ownerID: user1.id,
      requesterID: user1.id,
      itemID: listData[randomIntFromInterval(0, 3)].id,
      status: "accepted",
    });
    server.createList("request", 2, {
      ownerID: user2.id,
      requesterID: user4.id,
      itemID: listData2[randomIntFromInterval(0, 5)].id,
      status: "denied",
    });
  },

  routes() {
    this.namespace = "api";

    this.get("/users", (schema: AppSchema) => {
      return schema.all("user");
    });

    this.get("/users/:id", (schema: AppSchema, request) => {
      let userID = request.params.id;
      return schema.find("user", userID);
    });

    this.get("/users/bulk", (schema: AppSchema, request) => {
      const userIDs = request.queryParams.userIDs?.split(",") || [];
      return schema.where("user", user => userIDs.includes(user.id));
    });

    this.get("/chats/:id", (schema, request) => {
      let chatID = request.params.id;
      return schema.find("chat", chatID);
    });

    this.get("/chats/user/:userID", (schema: AppSchema, request) => {
      const {userID} = request.params;

      const chats = schema.where(
        "chat",
        chat => chat.ownerID === userID || chat.userID === userID,
      ).models;

      return chats.map(chat => {
        const messages = schema.where("message", {chatID: chat.id}).models;
        const lastMessage = messages.sort(
          (a, b) => +new Date(b.timestamp) - +new Date(a.timestamp),
        )[0];

        return {
          ...chat.attrs,
          lastMessage: lastMessage ? lastMessage.attrs : null,
        };
      });
    });

    this.get("/messages/:chatID", (schema, {params}) => {
      const {chatID} = params;

      return schema.where("message", {chatID});
    });

    this.post("/messages", (schema, request) => {
      let attrs = JSON.parse(request.requestBody);
      return schema.create("message", attrs);
    });

    this.patch("/messages/read", (schema, request) => {
      const {chatID} = JSON.parse(request.requestBody);

      const messages = schema.where("message", {chatID, read: null}).models;

      messages.forEach(message => {
        message.update({read: new Date().toISOString()});
      });

      return {success: true, updatedCount: messages.length};
    });

    this.get("/items", schema => {
      return schema.all("item");
    });

    this.get("/items/:id", (schema, request) => {
      const itemID = request.params.id;
      return schema.find("item", itemID);
    });

    this.get("/items/user/:userID", (schema, request) => {
      const {userID} = request.params;
      return schema.where("item", {userID});
    });

    this.get("/items/rentedBy/:userID", (schema, request) => {
      const {userID} = request.params;
      return schema.where("item", {currentlyRentedBy: userID});
    });

    this.get("/items/rentedFrom/:userID", (schema, request) => {
      const {userID} = request.params;

      return schema.where(
        "item",
        item => item.userID == userID && item.currentlyRentedBy != null,
      ).models;
    });

    this.get("/requests/to-user", (schema, request) => {
      const {ownerID, status} = request.queryParams;

      const query = {ownerID};
      if (status) query.status = status;

      let requests = schema.where("request", query).models;

      return requests.map(el => {
        const requester = schema.find("user", el.requesterID);
        const item = schema.find("item", el.itemID);

        return {
          ...el.attrs,
          requester: requester ? requester.attrs : null,
          item: item ? item.attrs : null,
        };
      });
    });

    this.get("/requests/from-user", (schema, request) => {
      const {requesterID, status} = request.queryParams;

      const query = {requesterID};
      if (status) query.status = status;

      let requests = schema.where("request", query).models;

      return requests.map(el => {
        const requester = schema.find("user", el.requesterID);
        const item = schema.find("item", el.itemID);

        return {
          ...el.attrs,
          requester: requester ? requester.attrs : null,
          item: item ? item.attrs : null,
        };
      });
    });

    this.get("/requests/:id", (schema, request) => {
      const requestID = request.params.id;
      return schema.find("request", requestID);
    });

    this.post("/requests", (schema, req) => {
      let attrs = JSON.parse(req.requestBody);
      return schema.create("request", attrs);
    });

    this.patch("/qr/scan", (schema, req) => {
      const {requestID} = JSON.parse(req.requestBody);

      const request = schema.where("request", {
        id: requestID,
        status: "accepted",
      }).models[0];
      if (!request) {
        return new Response(404, {}, {errors: ["Request not found"]});
      }
      request.update({status: "active"});

      const item = schema.find("item", request.itemID);
      if (!item) return new Response(404, {}, {errors: ["Item not found"]});

      item.update({currentlyRentedBy: request.requesterID});

      return {success: true};
    });

    this.post("/api/auth", (schema, request) => {
      const {address, signature} = JSON.parse(request.requestBody);

      // Nachricht zur Verifizierung
      const message = `Bitte signiere diese Nachricht: ${nonce}`;
      const publicKey = new PublicKey(address);

      // Verifizieren der Signatur
      const isValid = publicKey.verifyMessage(
        Buffer.from(message),
        Buffer.from(signature, "base64"),
      );

      if (isValid) {
        return {message: "Login erfolgreich!", user: {address}};
      } else {
        return new Response(401, {error: "Ungültige Signatur."});
      }
    });
  },
});
