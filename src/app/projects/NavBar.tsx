"use client"

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddEditProjectDialog from "@/components/AddEditProjectDialog";
import ThemeToggle from "@/components/ThemeToggle";

const NavBar = () => {
    const [showAddEditProjectDialog, setShowAddEditProjectDialog] = useState(false); 

    return (
        <>
            <div className="p-4 shadow">
                <div className="flex items-center justify-between felx-wrap gap-3 ">
                    <Link
                        href="/"
                        passHref
                        className="flex items-center gap-2 text-xl font-bold"
                    >
                        <Image
                            src={logo}
                            width={35}
                            height={35}
                            alt="logo"
                        />
                        <span className="font-bold">Ai project manager</span>
                    </Link>

                    <div className="flex items-center gap-8">
                        <Button onClick={() => setShowAddEditProjectDialog(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add project
                        </Button>
                        <ThemeToggle />
                        <UserButton afterSignOutUrl="/"/>
                    </div>
                    
                    
                </div>
            </div>

            <AddEditProjectDialog open={showAddEditProjectDialog} setOpen={setShowAddEditProjectDialog}/>
        </>
    );
};

export default NavBar;