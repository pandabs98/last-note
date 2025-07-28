import Contact from "@/models/Contact";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest){
    await dbConnect();

    try {
        const body = await req.json()
        const {name, email, message} = body;

        if(!name || !email || !message){
            return NextResponse.json(
                {error: "all fields are required"},
                {status: 400}
            )
        }
        const data = await Contact.create({
            name,
            email,
            message
        })

        return NextResponse.json(
            {message: "details saved successfully", data},
            {status: 201}
        )
    } catch (error) {
        console.log('an unwanted error occured', error)
        return NextResponse.json(
            {error: "details not saved to the server"},
            {status: 500}
        )
    }
}