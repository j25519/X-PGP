import { useState } from 'react'
import { motion } from 'framer-motion'
import KeyInput from './components/KeyInput'
import ProfileDisplay from './components/ProfileDisplay'
import Disclaimer from './components/Disclaimer'
import * as openpgp from 'openpgp'

const App = () => {
  const [keyText, setKeyText] = useState('')
  const [keyData, setKeyData] = useState(null)
  const [error, setError] = useState('')

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

      setKeyData({
        userIDs,
        fingerprint: key.getFingerprint().toUpperCase(),
        notations,
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
        {keyData && <ProfileDisplay keyData={keyData} />}
      </motion.div>
    </div>
  )
}

export default App