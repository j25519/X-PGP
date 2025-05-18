const Disclaimer = () => {
  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg mb-6 w-full max-w-2xl">
      <h2 className="text-xl font-semibold text-red-500">Important Disclaimer</h2>
      <p className="text-gray-300">
        Only upload <span className="font-bold">public</span> PGP keys. Do NOT upload private keys. All key processing happens locally in your browser—no data is sent to any server.
      </p>
    </div>
  )
}

export default Disclaimer