export const mockChats: Chat[] = [
  {
    id: "1",
    ownerID: "1",
    userID: "2",
    messages: [
      {
        ownerID: "1",
        message: "Hallo Bob! Wie geht es dir?",
        timestamp: new Date("2024-12-10T10:00:00Z"),
        read: new Date("2024-12-10T10:06:00Z"),
      },
      {
        ownerID: "2",
        message: "Hey Alice! Alles gut, danke. Wie sieht's bei dir aus?",
        timestamp: new Date("2024-12-10T10:05:00Z"),
        read: new Date("2024-12-10T10:06:00Z"),
      },
      {
        ownerID: "1",
        message: "Ich wollte fragen, ob du das Zelt noch hast?",
        timestamp: new Date("2024-12-10T10:10:00Z"),
      },
      {
        ownerID: "2",
        message: "Ja klar, wann möchtest du es abholen?",
        timestamp: new Date("2024-12-10T10:15:00Z"),
      },
      {
        ownerID: "1",
        message: "Wie wäre es morgen um 14 Uhr?",
        timestamp: new Date("2024-12-10T10:20:00Z"),
      },
    ],
  },
  {
    id: "2",
    ownerID: "1",
    userID: "4",
    messages: [
      {
        ownerID: "4",
        message: "Ist der Artikel noch verfügbar?",
        timestamp: new Date("2024-12-11T12:00:00Z"),
        read: new Date("2024-12-11T12:05:00Z"),
      },
      {
        ownerID: "1",
        message: "Ja, er ist noch verfügbar.",
        timestamp: new Date("2024-12-11T12:15:00Z"),
      },
      {
        ownerID: "4",
        message: "Super! Kann ich ihn heute Abend abholen?",
        timestamp: new Date("2024-12-11T12:20:00Z"),
      },
    ],
  },
  {
    id: "3",
    ownerID: "1",
    userID: "6",
    messages: [
      {
        ownerID: "6",
        message: "Wann kann ich den Artikel abholen?",
        timestamp: new Date("2024-12-12T08:00:00Z"),
      },
      {
        ownerID: "1",
        message: "Heute ab 14 Uhr passt es mir gut.",
        timestamp: new Date("2024-12-12T08:30:00Z"),
      },
      {
        ownerID: "6",
        message: "Okay, ich bin um 14 Uhr da.",
        timestamp: new Date("2024-12-12T09:00:00Z"),
      },
    ],
  },
];
