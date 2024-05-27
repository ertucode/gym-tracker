"use client";

import { BoltIcon, HomeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export function Nav() {
	const className = "size-5 text-blue-300";

	return (
		<ul className="m-3 flex gap-3">
			<li>
				<Link href="/">
					<HomeIcon className={className} />
				</Link>
			</li>
			<li>
				<Link href="/workouts">
					<BoltIcon className={className} />
				</Link>
			</li>
		</ul>
	);
}
