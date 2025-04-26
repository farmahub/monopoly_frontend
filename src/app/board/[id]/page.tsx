"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import clsx from "clsx";

interface Cell {
    name: string,
    position: number,
    color: string,
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
            <div className={"w-[90vh] h-[90vh] grid grid-cols-17 grid-rows-17 gap-1"}>
                {data.map((cell, index) => {
                    const u = 1;
                    const v = 3;
                    const corner = 4;
                    const shift = 1;
                    const division = 10;
                    const total = (2 * corner) + (9 * u);

                    const colSpan = [0, 10, 20, 30].includes(index) ? corner :
                        0 < index && index < 10 || 20 < index && index < 30 ? u :
                            10 < index && index < 20 || 30 < index && index < 40 ? v : 0;

                    const rowSpan = [0, 10, 20, 30].includes(index) ? corner :
                        0 < index && index < 10 || 20 < index && index < 30 ? v :
                            10 < index && index < 20 || 30 < index && index < 40 ? u : 0;

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
                            className={"flex items-center justify-center relative"}
                            style={{
                                gridColumnStart: colStart,
                                gridRowStart: rowStart,
                                gridColumnEnd: `span ${colSpan}`,
                                gridRowEnd: `span ${rowSpan}`,
                                backgroundColor: `var(--${cell.color})`
                            }}
                        >
                            <div
                                className={"absolute "}
                                style={{
                                    width: [0, 10, 20, 30].includes(index) ? 160 : 120,
                                    height: [0, 10, 20, 30].includes(index) ? 160 : 40,
                                    transform: `rotate(${orientation}deg)`
                                }}
                            >
                                <div className="w-full h-full flex flex-col items-center justify-start px-3 py-1">
                                    <strong
                                        className={"whitespace-nowrap font-extrablack roboto text-[12px]"}
                                    >{cell.name}</strong>
                                    <div className={"w-full flex items-center justify-between text-[11px]"}>
                                        <p>${cell.price}</p>
                                        <p>{cell.position}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export default Board;