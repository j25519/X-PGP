const ProfileDisplay = ({ keyData }) => {
  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return 'Unknown'
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-4">
          <span className="text-2xl">🖼️</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{keyData.userIDs[0]?.name || 'Unknown'}</h2>
          <p className="text-gray-300">{keyData.userIDs[0]?.email || 'No email'}</p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Fingerprint</h3>
        <p className="text-gray-300 font-mono">{keyData.fingerprint}</p>
      </div>
      {keyData.userIDs.length > 1 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Other User IDs</h3>
          <ul className="list-disc list-inside text-gray-300">
            {keyData.userIDs.slice(1).map((uid, index) => (
              <li key={index}>
                {uid.name} {uid.email && `<${uid.email}>`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {keyData.notations.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Identity Claims</h3>
          <ul className="list-disc list-inside text-gray-300">
            {keyData.notations.map((notation, index) => (
              <li key={index}>
                <a
                  href={notation.value}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {notation.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Technical Details</h3>
        <ul className="list-disc list-inside text-gray-300">
          <li>Key Type: {keyData.technicalDetails.keyType}</li>
          <li>Key ID: {keyData.technicalDetails.keyID}</li>
          <li>Creation Date: {formatDate(keyData.technicalDetails.creationDate)}</li>
          <li>Expiry Date: {formatDate(keyData.technicalDetails.expiryDate)}</li>
          <li>Revoked: {keyData.technicalDetails.isRevoked ? 'Yes' : 'No'}</li>
          {keyData.technicalDetails.subKeys.length > 0 && (
            <li>
              Subkeys:
              <ul className="list-circle list-inside ml-4">
                {keyData.technicalDetails.subKeys.map((subKey, index) => (
                  <li key={index}>
                    {subKey.algorithm} (ID: {subKey.keyID}, Usage: {subKey.usage})
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
      <p className="text-gray-400 text-sm mt-4">
        Note: Avatar support (Libravatar/Gravatar) requires an email match with your key.
      </p>
    </div>
  )
}

export default ProfileDisplay