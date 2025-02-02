"use client"
import { Sheet, SheetTrigger, SheetContent, SheetHeader,SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type MySheetComponentType = {
    trigger: ReactNode, // this itself is trigger
    title: string,
    description: string,
    content: ReactNode, // this itself is trigger
    
}

export default function MySheetComponent({trigger, title, description, content}: MySheetComponentType) {
    
    return (
        <Sheet>
            <SheetTrigger>
                {trigger}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="mb-3">
                    <SheetTitle className="text-2xl"> {title}</SheetTitle>
                </SheetHeader>
                {content}
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button">
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
