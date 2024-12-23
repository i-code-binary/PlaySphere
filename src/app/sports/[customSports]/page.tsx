"use client";

import { useParams } from "next/navigation";
import SportsData from "../../../data/sports_data.json";
export default function customSports() {
  const params = useParams();
  const { customSports } = params;
  
  return <div></div>;
}
