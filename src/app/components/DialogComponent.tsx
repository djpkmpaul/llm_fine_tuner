'use client'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type bodyType = {
    name: string,
    description: string,
    defaultValue: string | number | Array<string> | Boolean,
    otherValues: string | number | Boolean,
}
type DialogProp = {
    trigger: string,
    title: string,
    description: string,
    body: Array<bodyType>
}
export default function MyDialogComponent(props: DialogProp) {
    console.log(props);
    return (
        <div className="MyDialogComponent">
            <Dialog>
                <DialogTrigger>
                    <Button type="button" variant="ghost" className="text-slate-500">{props.trigger}</Button>
                </DialogTrigger>
                <DialogContent className="overflow-scroll h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {props.title}
                        </DialogTitle>
                        <DialogDescription>
                            {props.description}
                        </DialogDescription>
                    </DialogHeader>

                    {props.body.map((content: bodyType, idx: number)=>{
                        return(
                            <div className="flex justify-between flex-wrap flex-1 mb-2 border-2">
                                <DialogTitle className="p-2">
                                    {content.name}
                                </DialogTitle>
                                <DialogDescription className="p-2">
                                    {content.description}
                                </DialogDescription>
                                <DialogTitle className="text-zinc-500 text-sm p-2">
                                    Default Values : {content.defaultValue.toString()}
                                </DialogTitle>
                                <DialogTitle className="text-zinc-500 text-sm p-2">
                                    Default Values : {content.otherValues.toString()}
                                </DialogTitle>
                            </div>
                        )
                    })}
                </DialogContent>
            </Dialog>

        </div>
    )
}