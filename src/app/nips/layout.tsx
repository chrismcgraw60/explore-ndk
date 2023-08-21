
export default function NipsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <aside className="flex w-32 p-4">
            <div>NIPs</div>
            <div className="flex flex-col justify-between flex-1 mt-6">
              <nav>
                <NipLink label="01" href="nip-01" />
                <NipLink label="02" href="nip-02" />
                <NipLink label="03" href="nip-03" />
              </nav>
            </div>
        </aside>

        <div className="flex flex-1 flex-col">
            <div id="content" className=" flex flex-1 overflow-y-auto paragraph p-4 bg-gray-500">
                {children}
            </div>
        </div>
    </>
  )
}

function NipLink({
  label, href
} : {
  label: string; 
  href : string
}) {
  return (
    <a className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" 
      href={`/nips/${href}`}>

      <span className="mx-4 font-medium">{label}</span>
    </a>
  );
}