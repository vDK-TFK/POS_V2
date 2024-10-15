import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';
import {ScrollText,Trash,ArrowDownToLine } from "lucide-react";


const Adjuntar = () => (
        <Popover.Root>
        <Popover.Trigger asChild>
        <button className="p-1.5 text-gray-900 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform bg-blue-600 bg-opacity-50 rounded-md " ><ScrollText size={15}  strokeWidth={2.2}/></button>
        </Popover.Trigger>
        <Popover.Portal>
        <Popover.Content
            className="rounded p-5 w-auto bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
            sideOffset={5}
        >
            <div className="flex flex-col gap-2.5">
            <p className="text-mauve12 text-[15px] leading-[19px] font-medium mb-2.5">Emitida por Proveedor</p>
            <fieldset className="flex flex-col gap-5 items-center">
            <input
                type="file"
                name="file"
                />
                <button className="bg-verde font-semibold rounded-md py-2 px-6 text-white"> Adjuntar</button>
            </fieldset>
            </div>
            <Popover.Close
            className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-gray-700 absolute top-[5px] right-[5px] hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default"
            aria-label="Close"
            >
            <Cross2Icon />
            </Popover.Close>
            <Popover.Arrow className="fill-white" />
        </Popover.Content>
        </Popover.Portal>
        </Popover.Root>
);

export default Adjuntar;
