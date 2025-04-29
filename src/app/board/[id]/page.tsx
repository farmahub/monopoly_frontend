"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import clsx from "clsx";
import { inherits } from "util";

interface Cell {
    name: string,
    position: number,
    color: string,
    type: string,
    price: number,
    rent_single: number,
    rent_set: number,
    rent_1: number,
    rent_2: number,
    rent_3: number,
    rent_4: number,
    rent_5: number,
    loan_amount: number,
    loan_back_amount: number,
    house_price: number,
    hotel_price: number,
    dwelling_counts: number,
    owner: string,
    image: string,
}

const Board: React.FC = () => {
    const [data, setData] = useState<Cell[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }
            const response = await axios.get(process.env.NEXT_PUBLIC_API + "/api/properties/", config)

            if (response.data) {
                setData(response.data)
            }
        }

        fetchData()
    }, [])

    return (
        <div className={"w-screen h-screen flex justify-center items-center bg-background"}>
            <div className={"w-[90vh] h-[90vh] grid grid-cols-30 grid-rows-30"}>
                {data.map((cell, index) => {
                    const u = 2;
                    const v = 5;
                    const corner = 6;
                    const shift = 1;
                    const division = 10;
                    const total = (2 * corner) + (9 * u);

                    const [colSpan, rowSpan] = [0, 10, 20, 30].includes(index) ? [corner, corner] :
                        0 < index && index < 10 || 20 < index && index < 30 ? [u, v] :
                            10 < index && index < 20 || 30 < index && index < 40 ? [v, u] : [0, 0];

                    const colStart = [0, 30].includes(index) ? shift :
                        [10, 20].includes(index) ? (shift + corner) + (9 * u) :
                            0 < index && index < 10 ? (corner + shift) + ((index - shift) * u) :
                                10 < index && index < 20 ? (shift + corner) + (9 * u) :
                                    20 < index && index < 30 ? (total - (corner - shift)) - ((index - (2 * division)) * u) :
                                        30 < index && index < 40 ? shift + corner - v : 0;

                    const rowStart = [0, 10].includes(index) ? shift :
                        [20, 30].includes(index) ? (shift + corner) + (9 * u) :
                            0 < index && index < 10 ? shift + corner - v :
                                10 < index && index < 20 ? (corner + shift) + ((index - shift - division) * u) :
                                    20 < index && index < 30 ? (shift + corner) + (9 * u) :
                                        30 < index && index < 40 ? (total - (corner - shift)) - ((index - (3 * division)) * u) : 0;

                    const orientation = index === Number(0) ? 135 :
                        index === Number(10) ? 225 :
                            index === Number(20) ? 315 :
                                index === Number(30) ? 45 :
                                    0 < index && index < 10 ? 180 + 90 :
                                        10 < index && index < 20 ? 270 + 90 :
                                            20 < index && index < 30 ? 0 + 90 :
                                                30 < index && index < 40 ? 90 + 90 : 0;

                    return (
                        <div
                            key={index}
                            className={"flex items-center justify-center relative border border-white"}
                            style={{
                                gridColumnStart: colStart,
                                gridRowStart: rowStart,
                                gridColumnEnd: `span ${colSpan}`,
                                gridRowEnd: `span ${rowSpan}`,
                                backgroundColor: `var(--${cell.color})`
                            }}
                        >
                            <div
                                className={"absolute flex flex-col justify-center items-center"}
                                style={{
                                    width: [0, 10, 20, 30].includes(index) ? 100 : 110,
                                    height: [0, 10, 20, 30].includes(index) ? 100 : 40,
                                    transform: `rotate(${orientation}deg)`
                                }}
                            >
                                {cell.color && (
                                    <div className="w-full h-full">
                                        <div
                                            className={"w-full h-1/2 flex justify-center items-center whitespace-nowrap text-[9px] roboto font-black"}
                                        >
                                            <strong>{cell.name.toUpperCase()}</strong>
                                        </div>
                                        <div
                                            className={"w-full h-1/2 flex gap-3 px-2"}
                                        >
                                            <div className={"w-1/2 h-full flex"}>
                                                <div className={"w-1/2 h-full flex items-center text-[7px] leading-1.5"}>
                                                    <p>FOR<br />SALE</p>
                                                </div>
                                                <div className={"w-1/2 h-full flex items-center roboto font-black text-[10px]"}>
                                                    <p>${cell.price}</p>
                                                </div>
                                            </div>
                                            <div className={"w-1/2 h-full flex"}>
                                                <div className={"w-1/2 h-full flex items-center text-[7px] leading-1.5"}>
                                                    <p>LAND<br />RENT</p>
                                                </div>
                                                <div className={"w-1/2 h-full flex items-center roboto font-black text-[10px]"}>
                                                    <p>{cell.type === "station" ? "$" + cell.rent_1 : "$" + cell.rent_single}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {cell.name === "Chance" && (
                                    <div className="w-full h-full p-2 bg-[var(--chance-1)]">
                                        <div className={"w-full h-full flex items-center justify-center bg-brightgrey"}>
                                            <strong className={"whitespace-nowrap text-[11px] roboto font-extrablack"}>{cell.name.toUpperCase()}</strong>
                                        </div>
                                    </div>
                                )}
                                {cell.name === "Community Chest" && (
                                    <div className="w-full h-full p-2 bg-[var(--chance-2)]">
                                        <div className={"w-full h-full flex items-center justify-center bg-brightgrey"}>
                                            <strong className={"whitespace-nowrap text-[9px] roboto font-extrablack"}>{cell.name.toUpperCase()}</strong>
                                        </div>
                                    </div>
                                )}
                                {cell.name.toLowerCase().includes("tax") && (
                                    <div className="w-full h-full p-2 bg-[var(--tax)] roboto font-black">
                                        <div className={"w-full h-full flex items-center justify-center bg-brightgrey"}>
                                            <strong className={"whitespace-nowrap text-[10px] roboto font-extrablack"}>{cell.name.toUpperCase()}</strong>
                                        </div>
                                    </div>
                                )}
                                {cell.type === "utility" && (
                                    <div
                                        className="w-full h-full p-2 roboto font-black"
                                        style={{
                                            backgroundColor: cell.name === "Water Works" ? "var(--blue)" : "var(--yellow)",
                                        }}
                                    >
                                        <div className={"w-full h-full flex items-center justify-center bg-brightgrey"}>
                                            <strong className={"whitespace-nowrap text-[8px] roboto font-extrablack"}>{cell.name.toUpperCase()}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
                {Array.from({ length: 36 }).map((cell, index) => {
                    const u = 2;
                    const v = 1;
                    const corner = 6;
                    const shift = 1;
                    const division = 9;
                    const total = (2 * corner) + (9 * u);

                    const colSpan = 0 <= index && index < 9 ? u :
                        9 <= index && index < 18 ? v :
                            18 <= index && index < 27 ? u :
                                27 <= index && index < 36 ? v : 0;
                    const rowSpan = 0 <= index && index < 9 ? v :
                        9 <= index && index < 18 ? u :
                            18 <= index && index < 27 ? v :
                                27 <= index && index < 36 ? u : 0;
                    const colStart = 0 <= index && index < 9 ? (corner + shift) + (index * u) :
                        9 <= index && index < 18 ? (corner * 2) + (9 * u) :
                            18 <= index && index < 27 ? (total - corner - shift) - ((index - (2 * division)) * u) :
                                27 <= index && index < 36 ? 1 : 0;

                    const rowStart = 0 < index && index < 9 ? 1 :
                        9 <= index && index < 18 ? (corner + shift) + ((index - division) * u) :
                            18 <= index && index < 27 ? (corner * 2) + (9 * u) :
                                27 <= index && index < 36 ? (total - corner - shift) - ((index - (3 * division)) * u) : 0;
                    return (
                        <div
                            key={index}
                            className={"flex items-center justify-center relative bg-vine"}
                            style={{
                                gridColumnStart: colStart,
                                gridRowStart: rowStart,
                                gridColumnEnd: `span ${colSpan}`,
                                gridRowEnd: `span ${rowSpan}`,
                            }}
                        >
                            <p className={"text-white text-sm"}>
                                {index}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export default Board;