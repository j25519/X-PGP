import { useState } from 'react'
import { motion } from 'framer-motion'
import KeyInput from './components/KeyInput'
import ProfileDisplay from './components/ProfileDisplay'
import Disclaimer from './components/Disclaimer'
import ErrorBoundary from './components/ErrorBoundary'
import * as openpgp from 'openpgp'

const App = () => {
  const [keyText, setKeyText] = useState('')
  const [keyData, setKeyData] = useState(null)
  const [error, setError] = useState('')

  const normalizeAlgorithmName = (algInfo) => {
    const rawName = algInfo.name || algInfo.algorithm || 'Unknown'
    switch (rawName.toLowerCase()) {
      case 'rsaencryptsign':
      case 'rsaencrypt':
      case 'rsasign':
        return 'RSA'
      case 'eddsa':
        return 'EdDSA'
      case 'eddsalegacy':
        return 'EdDSA (Legacy)'
      case 'ecdh':
        return 'ECDH'
      case 'ecdsa':
        return 'ECDSA'
      case 'elgamal':
        return 'ElGamal'
      case 'dsa':
        return 'DSA'
      default:
        return rawName
    }
  }

  const normalizeCurveName = (curve) => {
    if (!curve) return null
    switch (curve.toLowerCase()) {
      case 'ed25519legacy':
        return 'Ed25519 (Legacy)'
      case 'curve25519legacy':
        return 'Curve25519 (Legacy)'
      case 'curve25519':
        return 'X25519'
      case 'p256':
        return 'P-256'
      case 'p384':
        return 'P-384'
      case 'p521':
        return 'P-521'
      case 'secp256k1':
        return 'secp256k1'
      default:
        return curve
    }
  }

  const isEllipticCurveAlgorithm = (algName) => {
    const lowerName = algName.toLowerCase()
    return ['eddsa', 'eddsalegacy', 'ecdh', 'ecdsa'].includes(lowerName)
  }

  const parseKey = async (text) => {
    try {
      const key = await openpgp.readKey({ armoredKey: text })
      const userIDs = key.getUserIDs().map((uid) => {
        const match = uid.match(/(.*?) <(.*?)>|(.*)/)
        return {
          name: match[1] || match[3] || '',
          email: match[2] || '',
          raw: uid,
        }
      })

      const notations = []
      const subKeys = key.getSubkeys()
      for (const subKey of subKeys) {
        const binding = subKey.bindingSignatures[0]
        if (binding && binding.notation) {
          for (const [name, value] of Object.entries(binding.notation)) {
            if (name.startsWith('proof@ariadne.id')) {
              notations.push({ name, value })
            }
          }
        }
      }

      // Extract technical details
      const primaryKey = key.keyPacket
      const algorithmInfo = primaryKey.getAlgorithmInfo()
      console.log('Primary algorithmInfo:', algorithmInfo) // Debug log
      const primaryAlgName = normalizeAlgorithmName(algorithmInfo)
      const subKeysDetails = subKeys.map((subKey) => {
        const subAlg = subKey.getAlgorithmInfo()
        console.log('Subkey algorithmInfo:', subAlg) // Debug log
        const usage = []
        if (subKey.bindingSignatures[0]?.keyFlags) {
          const flags = subKey.bindingSignatures[0].keyFlags
          if (flags & openpgp.enums.keyFlags.signData) usage.push('Signing')
          if (flags & openpgp.enums.keyFlags.encryptCommunication) usage.push('Encryption')
          if (flags & openpgp.enums.keyFlags.encryptStorage) usage.push('Storage Encryption')
        }
        const subAlgName = normalizeAlgorithmName(subAlg)
        return {
          keyID: subKey.getKeyID().toHex().toUpperCase(),
          algorithm: `${subAlgName}${subAlg.bits ? ` (${subAlg.bits} bits)` : ''}`,
          curve: isEllipticCurveAlgorithm(subAlgName.toLowerCase()) ? normalizeCurveName(subAlg.curve) : null,
          usage: usage.join(', ') || 'Unknown',
        }
      })

      setKeyData({
        userIDs,
        fingerprint: key.getFingerprint().toUpperCase(),
        notations,
        technicalDetails: {
          keyType: `${primaryAlgName}${algorithmInfo.bits ? ` (${algorithmInfo.bits} bits)` : ''}`,
          curve: isEllipticCurveAlgorithm(primaryAlgName.toLowerCase()) ? normalizeCurveName(algorithmInfo.curve) : null,
          keyID: key.getKeyID().toHex().toUpperCase(),
          creationDate: key.getCreationTime(),
          expiryDate: key.getExpirationTime() || null,
          subKeys: subKeysDetails,
          isRevoked: await key.isRevoked(),
        },
      })
      setError('')
    } catch (err) {
      setError('Invalid PGP key. Please ensure it’s a valid public key.')
      setKeyData(null)
    }
  }

  const headerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <motion.h1
        className="text-4xl font-bold mb-6 will-change-opacity will-change-transform"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
        variants={headerVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        X PGP
      </motion.h1>
      <motion.div
        className="w-full max-w-2xl will-change-opacity will-change-transform"
        variants={contentVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      >
        <Disclaimer />
        <KeyInput
          keyText={keyText}
          setKeyText={setKeyText}
          parseKey={parseKey}
          setError={setError}
        />
        {error && (
          <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-6 w-full">
            <p>{error}</p>
          </div>
        )}
        {keyData && (
          <ErrorBoundary>
            <ProfileDisplay keyData={keyData} />
          </ErrorBoundary>
        )}
      </motion.div>
    </div>
  )
}

export default App