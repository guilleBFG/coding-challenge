import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

const goalSchema = z.object({ goal: z.array(z.array(z.string())) });
const candidateID = "b4c1ea52-39dc-48d9-97b4-d90c93e04d67";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getGoal: publicProcedure
    .input(z.object({ candidateID: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await fetch(
          `https://challenge.crossmint.io/api/map/${input.candidateID}/goal`
        );
        const resultData = goalSchema.parse(await result.json());
        return resultData;
      } catch (error) {
          return { goal: [[]]}
      }
      
    }),
  postPlanet: publicProcedure
    .input(
      z.object({
        row: z.string(),
        column: z.string(),
        colorOrDirection: z.string().optional(),
        type: z.union([
          z.literal("POLYANET"),
          z.literal("SOLOON"),
          z.literal("COMETH"),
        ]),
      })
    )
    .mutation(async ({ input }) => {
      let post = {};
      let apiEndpoint = "";
      
      if ((input.type === "POLYANET")) {
        apiEndpoint = "https://challenge.crossmint.io/api/polyanets";
        post = {
          row: input?.row,
          column: input?.column,
          candidateId: candidateID,
        };        
      }

      if ((input.type === "SOLOON")) {
        apiEndpoint = "https://challenge.crossmint.io/api/soloons";
        post = {
          row: input?.row,
          column: input.column,
          color: input.colorOrDirection,
          candidateId: candidateID,
        };
      }

      if ((input.type === "COMETH")) {
        apiEndpoint = "https://challenge.crossmint.io/api/comeths";
        post = {
          row: input?.row,
          column: input.column,
          direction: input.colorOrDirection,
          candidateId: candidateID,
        };
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      await response.json()
    }),
  deletePlanet: publicProcedure
    .input(
      z.object({
        row: z.string(),
        column: z.string(),
        type: z.union([
          z.literal("POLYANET"),
          z.literal("SOLOON"),
          z.literal("COMETH"),
        ]),
      })
    )
    .mutation(async ({ input }) => {

      const deletePlanet = {
        row: Number(input?.row),
        column: Number(input.column),
        candidateId: candidateID,
      };

      let apiEndpoint = "";
      if ((input.type === "POLYANET")) {
        apiEndpoint = "https://challenge.crossmint.io/api/polyanets";
       
      }

      if ((input.type === "SOLOON")) {
        apiEndpoint = "https://challenge.crossmint.io/api/soloons";
      }

      if ((input.type === "COMETH")) {
        apiEndpoint = "https://challenge.crossmint.io/api/comeths";
      }
      
      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deletePlanet),
      });

      await response.json()
      

    }),
});
