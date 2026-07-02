"use client"
import dynamic from "next/dynamic"
const Grove = dynamic(() => import("../grove"), { ssr: false })
export default function AppPage() { return <Grove /> }
