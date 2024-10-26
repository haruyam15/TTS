import { useEffect, useState } from 'react'

type LanguageOption = {
  code: string
  name: string
}

type LanguageCode = (typeof languageOptions)[number]['code']

const languageOptions: LanguageOption[] = [
  { code: 'ko-KR', name: '한국어 (대한민국)' },
  { code: 'en-US', name: '영어 (미국)' },
  { code: 'en-GB', name: '영어 (영국)' },
  { code: 'en-AU', name: '영어 (호주)' },
  { code: 'en-CA', name: '영어 (캐나다)' },
  { code: 'en-IN', name: '영어 (인도)' },
  { code: 'zh-CN', name: '중국어 (중국)' },
  { code: 'zh-TW', name: '중국어 (대만)' },
  { code: 'zh-HK', name: '중국어 (홍콩)' },
  { code: 'ja-JP', name: '일본어 (일본)' },
  { code: 'es-ES', name: '스페인어 (스페인)' },
  { code: 'es-MX', name: '스페인어 (멕시코)' },
  { code: 'es-US', name: '스페인어 (미국)' },
  { code: 'fr-FR', name: '프랑스어 (프랑스)' },
  { code: 'fr-CA', name: '프랑스어 (캐나다)' },
  { code: 'de-DE', name: '독일어 (독일)' },
  { code: 'it-IT', name: '이탈리아어 (이탈리아)' },
  { code: 'pt-BR', name: '포르투갈어 (브라질)' },
  { code: 'pt-PT', name: '포르투갈어 (포르투갈)' },
  { code: 'ru-RU', name: '러시아어 (러시아)' },
  { code: 'ar-SA', name: '아랍어 (사우디아라비아)' },
  { code: 'ar-EG', name: '아랍어 (이집트)' }
]

function App() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [text, setText] = useState('')
  const [lang, setLang] = useState(languageOptions[0].code)

  useEffect(() => {
    const loadVoices = () => {
      const voicesList = speechSynthesis.getVoices()
      setVoices(voicesList)
    }

    // 음성이 변경되거나 로드된 후 `loadVoices` 호출
    speechSynthesis.addEventListener('voiceschanged', loadVoices)

    // 초기 음성 로드 호출 (이미 로드된 경우 대비)
    loadVoices()

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value)
  }

  const textToSpeech = (targetText: string, lang: LanguageCode) => {
    console.log(lang)

    if (targetText.length === 0) {
      alert('텍스트를 입력해주세요.')
      return
    }
    const utterance = new SpeechSynthesisUtterance(targetText)
    utterance.lang = lang
    utterance.pitch = 1
    utterance.rate = 1
    utterance.volume = 1

    utterance.voice = voices.find(voice => voice.lang === lang) || null

    if (utterance.voice === null) {
      alert('사용 가능한 언어가 없습니다.')
      return
    }

    console.log(utterance.voice)
    utterance.addEventListener('end', () => {
      console.log('음성 변환이 완료되었습니다.')
    })

    speechSynthesis.speak(utterance)
  }

  const handleClick = () => {
    textToSpeech(text, lang)
  }
  return (
    <>
      <input
        type="text"
        onChange={handleChange}
        value={text}
      />

      <select
        name="lang"
        id="lang"
        onChange={handleSelect}
        value={lang}>
        {languageOptions.map(opt => (
          <option
            value={opt.code}
            key={opt.code}>
            {opt.name}
          </option>
        ))}
      </select>
      <button onClick={handleClick}>TTS 변환하기</button>
    </>
  )
}

export default App
