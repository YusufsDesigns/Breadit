import { auth } from "@/auth";
import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth()
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 py-6 md:grid-cols-3 gap-y-4 md:gap-x-4">
        {session ? <CustomFeed /> : <GeneralFeed />}
        {session?.user.username}
        {/* Subreddit Info */}
        <div className="order-first overflow-hidden border border-gray-200 rounded-lg h-fit md:order-last">
          <div className="px-6 py-4 bg-emerald-100">
            <p className="flex items-center font-semibold py-3 gap-1.5">
              <HomeIcon className="w-4 h-4" />
              Home
            </p>
          </div>

          <div className="px-6 py-4 my-3 text-sm leading-6 divide-y divide-gray-100">
            <div className="flex justify-between py-3 gap-x-4">
              <p className="text-zinc-500">
                Your Personal Breadit homepage. Come here to check in with your favorite communities
              </p>
            </div>
            <Link className={buttonVariants({className: 'w-full mt-4 mb-4'})} href='/r/create'>Create Community</Link>
          </div>
        </div>
      </div>
    </>
  )
}
