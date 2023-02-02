import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { z } from "zod";

import { api } from "../utils/api";

const planetOptions = ["POLYANET", "SOLOON", "COMETH"];
type Planets = "POLYANET" | "SOLOON" | "COMETH";

const Home: NextPage = () => {
  const [cellInfo, setCellInfo] = useState<{ row?: string; column?: string }>();

  const [planet, setPlanet] = useState(planetOptions[0]);
  

  const goal = api.example.getGoal.useQuery({
    candidateID: "b4c1ea52-39dc-48d9-97b4-d90c93e04d67",
  });

  const { mutateAsync: postPlanet } = api.example.postPlanet.useMutation();
  const { mutateAsync: deletePlanet } = api.example.deletePlanet.useMutation();


  

  const setCell = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!cellInfo?.row || !cellInfo?.column || !planet) return;

    await postPlanet({
      row: cellInfo.row,
      column: cellInfo.column,
      type: planet as Planets,
    });

    return;
  };
  const deleteCell = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!cellInfo?.row || !cellInfo?.column || !planet) return;

    await deletePlanet({
      row: cellInfo.row,
      column: cellInfo.column,
      type: planet as Planets,
    });

    return;
  };

  const processGoalMap = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!goal.data) return;

    goal.data.goal.map((row, rowIndex) => {
      row.map(async (cell, columnIndex) => {
        
        if (cell !== "SPACE") {
          let directionOrColor = [];
          if (cell.includes("_")) {
            directionOrColor = cell.split("_");

            await postPlanet({
              row: rowIndex.toString(),
              column: columnIndex.toString(),
              colorOrDirection: directionOrColor[0]?.toLowerCase(),
              type: directionOrColor[1] as Planets,
            });
          } else {
            await postPlanet({
              row: rowIndex.toString(),
              column: columnIndex.toString(),
              type: cell as Planets,
            });
          }
        }
      });
    });

    return;
  };

  const clearMap = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (!goal.data) return;

    goal.data.goal.map((row, rowIndex) => {
      row.map(async (cell, columnIndex) => {
        if (cell !== "SPACE") {
          let directionOrColor = [];
          if (cell.includes("_")) {
            directionOrColor = cell.split("_");

            await deletePlanet({
              row: rowIndex.toString(),
              column: columnIndex.toString(),
              type: directionOrColor[1] as Planets,
            });
          } else {
            await deletePlanet({
              row: rowIndex.toString(),
              column: columnIndex.toString(),
              type: cell as Planets,
            });
          }
        }
      });
    });

    return;
  };

  return (
    <>
      <Head>
        <title>Crossmint challenge</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Grid is 30 x 30
          </h1>
          <div className="text-white">
            {/*
            this was used to see the map, I thought it would update when the api was called 
            the solution for the logo is to loop the arrays and call each apy endpoint accordingly 

            goal.data?.goal.map((goalRow, index) => {
              return (
                <div
                  className="flex flex-column space-x-2"
                  key={`row-index-${index}`}
                >
                  {goalRow.map((goalCell, index) => {
                    return (
                      <div className="p-2" key={`column-index-${index}`}>
                        {goalCell}
                      </div>
                    );
                  })}
                </div>
              );
            }) */}
            {/*}
            <form className=" mt-4 flex  flex-col space-y-2 text-white">
              <input
                className="text-black "
                placeholder="Row number"
                onChange={(event) =>
                  setCellInfo({ ...cellInfo, row: event.target.value })
                }
              ></input>
              <input
                onChange={(event) =>
                  setCellInfo({ ...cellInfo, column: event.target.value })
                }
                className="text-black"
                placeholder="Column number"
              ></input>

              <div className="text-black">
                <select
                  value={planet}
                  onChange={(e) => setPlanet(e.target.value)}
                >
                  {planetOptions.map((planet) => (
                    <option value={planet} key={planet}>
                      {planet}
                    </option>
                  ))}
                </select>
              </div>


              <button
                onClick={(event) => void setCell(event)}
                className="... inline-flex rounded-lg bg-gradient-to-r from-green-400 to-blue-500 p-3 hover:from-pink-500 hover:to-yellow-500"
              >
                Set
              </button>
              <button
                onClick={(event) => void deleteCell(event)}
                className="... inline-flex rounded-lg bg-gradient-to-r from-green-400 to-blue-500 p-3 hover:from-pink-500 hover:to-yellow-500"
              >
                Delete
              </button>
            </form>

                              {*/}
            {goal.data ? (
              <div className="p-4 text-xl">Goal Map Loaded</div>
            ) : (
              <div className="p-4 text-xl">Loading</div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={(event) => void processGoalMap(event)}
                className="... inline-flex rounded-lg bg-gradient-to-r from-green-400 to-blue-500 p-3 hover:from-pink-500 hover:to-yellow-500"
              >
                Process Goal Map
              </button>
              <button
                onClick={(event) => void clearMap(event)}
                className="... inline-flex rounded-lg bg-gradient-to-r from-green-400 to-blue-500 p-3 hover:from-pink-500 hover:to-yellow-500"
              >
                Clear Goal Map
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
