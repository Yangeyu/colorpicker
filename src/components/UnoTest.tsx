const UnoTest = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">UnoCSS Test</h1>
      <div className="flex gap-4">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Green Button
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Red Button
        </button>
        <div className="bg-yellow-200 p-4 rounded border border-yellow-500">
          This is a yellow box with padding and rounded corners
        </div>
      </div>
    </div>
  )
}

export default UnoTest 