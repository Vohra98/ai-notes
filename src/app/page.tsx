import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {

  const { userId } = auth();

  if (userId) redirect("/projects");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center">
        <Link
          href="/"
          passHref
          className="flex items-center gap-2 text-xl font-bold"
        >
          <Image src={logo} width={50} height={50} alt="logo" />
          <span className="text-xl lg:text-4xl">Ai project manager</span>
        </Link>
        
      </div>
      <p className="text-center max-w-prose">
          An intelligent project manager that helps you manage your projects using AI and ML. Built with Next.js, OpenAI, Shadcn UI Clerk and more.
      </p>
      <Button asChild>
        <Link href="/projects">
          Get started
        </Link>
        
      </Button>
    </main>
  );
}
