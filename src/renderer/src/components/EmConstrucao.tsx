export function EmConstrucao({ titulo }: { titulo: string }): React.JSX.Element {
  return (
    <div className="flex h-full items-center justify-center text-zinc-500 dark:text-zinc-400">
      {titulo}: em construção
    </div>
  )
}
