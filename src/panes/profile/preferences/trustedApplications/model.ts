export type Mode = 'Read' | 'Append' | 'Write' | 'Control'

export interface TrustedApplication {
  origin: string
  subject: string
  modes: Mode[]
}
