const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const events = [];
app.use(
	"/graphql",
	graphqlHTTP({
		schema: buildSchema(`
            type Event{
              _id: ID
              title: String!
              description: String!
              price: Float!
              date: String!
            }
            input EventInput{
              title: String!
              description: String!
              price: Float!
              date: String!
            }
		        type RootQuery{
              events: [Event!]!
            }
            type RootMutation{
              createEvent(eventInput: EventInput): Event
            }

            schema{
                query: RootQuery
                mutation: RootMutation
            }`),
		rootValue: {
			events: () => {
				console.log("request received");
				return events;
			},
			createEvent: (args) => {
				const event = {
					_id: Math.random().toString(),
					title: args.eventInput.title,
					description: args.eventInput.description,
					price: +args.eventInput.price,
					date: new Date().toISOString(),
				};
				events.push(event);
				return event;
			},
		},
		graphiql: true,
	})
);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
