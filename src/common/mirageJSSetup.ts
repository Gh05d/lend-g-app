import {createServer, Factory, Model, belongsTo, hasMany} from "miragejs";
import {faker} from "@faker-js/faker";
import {ModelDefinition, Registry} from "miragejs/-types";
import Schema from "miragejs/orm/schema";

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
          endDate: faker.date.future().toISOString().split("T")[0],
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
    server.createList("message", 5, {chatID: chat1.id});

    const chat2 = server.create("chat", {
      ownerID: user1.id,
      userID: user3.id,
    });
    server.createList("message", 3, {chatID: chat2.id});

    const chat3 = server.create("chat", {ownerID: user4.id, userID: user4.id});
    server.createList("message", 5, {chatID: chat3.id});

    const listData = server.createList("item", 4, {userID: user1.id});
    const listData2 = server.createList("item", 6, {userID: user2.id});
    const listData3 = server.createList("item", 8, {userID: user3.id});

    server.createList("request", 5, {
      ownerID: user1.id,
      itemID: listData[0].id,
      requesterID: user2.id,
    });
    server.createList("request", 2, {
      ownerID: user3.id,
      requesterID: user4.id,
      itemID: listData3[0].id,
      status: "open",
    });
    server.createList("request", 3, {
      ownerID: user1.id,
      requesterID: user1.id,
      itemID: listData[1].id,
      status: "accepted",
    });
    server.createList("request", 2, {
      ownerID: user2.id,
      requesterID: user4.id,
      itemID: listData2[0].id,
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
      const userIDs = request.queryParams.userIDs?.split(",");
      return schema.where("user", user => userIDs.includes(user.id));
    });

    this.get("/requests/user/:id", (schema, request) => {
      const ownerID = request.params.id;
      const {status} = request.queryParams;

      let requests = schema.where("request", {ownerID}).models;

      if (status) {
        requests = requests.filter(item => item.status === status);
      }

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

    this.get("/chats", schema => {
      return schema.all("chat");
    });

    this.get("/chats/:id", (schema, request) => {
      let chatID = request.params.id;
      return schema.find("chat", chatID);
    });

    this.get("/messages", schema => {
      return schema.all("message");
    });

    this.post("/messages", (schema, request) => {
      let attrs = JSON.parse(request.requestBody);
      return schema.create("message", attrs);
    });

    this.get("/items", schema => {
      return schema.all("item");
    });

    this.get("/items/:id", (schema, request) => {
      const itemID = request.params.id;
      return schema.find("item", itemID);
    });

    this.get("/items/user/:id", (schema, request) => {
      const userID = request.params.id;
      return schema.where("item", {userID});
    });

    this.get("/items/rentedBy/:userID", (schema, request) => {
      const {userID} = request.params;
      return schema.where("item", {currentlyRentedBy: userID});
    });

    this.get("/requests", schema => {
      return schema.all("request");
    });

    this.get("/requests/:id", (schema, request) => {
      const requestID = request.params.id;
      return schema.find("request", requestID);
    });

    this.post("/requests", (schema, request) => {
      let attrs = JSON.parse(request.requestBody);
      return schema.create("request", attrs);
    });
  },
});
