import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button className="inline-flex items-center justify-center p-2 hover:text-white hover:bg-blue-700 focus:outline-none">
      <span className="sr-only">Dark / light theme toggle</span>
      {resolvedTheme === 'dark' ? (
        <span
          className="block"
          aria-hidden="true"
          title="Switch to the light theme"
          onClick={() => setTheme('light')}
        >
          [☀︎]
        </span>
      ) : (
        <span
          className="block"
          aria-hidden="true"
          title="Switch to the dark theme"
          onClick={() => setTheme('dark')}
        >
          [☀︎]
        </span>
      )}
    </button>
  )
}
