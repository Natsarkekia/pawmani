import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, PawPrint } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const { t } = await getT();
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/messages");

  const profile = await db.breederProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const conversations = await db.conversation.findMany({
    where: {
      OR: [
        { buyerId: session.user.id },
        ...(profile ? [{ breederId: profile.id }] : []),
      ],
    },
    orderBy: { lastMsgAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, images: { where: { isPrimary: true }, take: 1 } } },
      buyer: { select: { id: true, name: true, image: true } },
      breeder: { select: { id: true, user: { select: { id: true, name: true, image: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const unreadCounts = await Promise.all(
    conversations.map((conv) =>
      db.message.count({
        where: { conversationId: conv.id, senderId: { not: session.user.id }, readAt: null },
      })
    )
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("nav_messages")}</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No messages yet</p>
          <p className="text-sm mt-1">When you contact a breeder, your conversations will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {conversations.map((conv, i) => {
            const isUserBuyer = conv.buyerId === session.user.id;
            const otherParty = isUserBuyer
              ? { name: conv.breeder.user.name, image: conv.breeder.user.image }
              : { name: conv.buyer.name, image: conv.buyer.image };
            const lastMsg = conv.messages[0];
            const unread = unreadCounts[i];

            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-all bg-white dark:bg-gray-800 shadow-sm"
              >
                <Avatar src={otherParty.image} name={otherParty.name} size={56} className="rounded-xl shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-semibold text-gray-900 dark:text-white truncate">{otherParty.name}</p>
                    {lastMsg && (
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(lastMsg.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {conv.listing.images[0] ? (
                      <Image
                        src={conv.listing.images[0].url}
                        alt={conv.listing.title}
                        width={16}
                        height={16}
                        className="w-4 h-4 rounded object-cover shrink-0"
                      />
                    ) : (
                      <PawPrint className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.listing.title}</p>
                  </div>
                  {lastMsg && (
                    <p className={`text-sm mt-0.5 truncate ${unread > 0 ? "font-semibold text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                      {lastMsg.senderId === session.user.id ? t("msg_you") : ""}{lastMsg.content}
                    </p>
                  )}
                </div>

                {unread > 0 && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">{unread > 9 ? "9+" : unread}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
