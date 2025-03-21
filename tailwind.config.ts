
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'rgba(0, 0, 0, 0.05)',
				input: 'rgba(0, 0, 0, 0.05)',
				ring: 'rgba(0, 0, 0, 0.3)',
				background: '#FFFFFF',
				foreground: '#1D1D1F',
				primary: {
					DEFAULT: '#0071E3',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#F5F5F7',
					foreground: '#1D1D1F'
				},
				destructive: {
					DEFAULT: '#FF3B30',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F5F5F7',
					foreground: '#86868B'
				},
				accent: {
					DEFAULT: '#E8E8ED',
					foreground: '#1D1D1F'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1D1D1F'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1D1D1F'
				},
				sidebar: {
					DEFAULT: '#F5F5F7',
					foreground: '#1D1D1F',
					primary: '#0071E3',
					'primary-foreground': '#FFFFFF',
					accent: '#E8E8ED',
					'accent-foreground': '#1D1D1F',
					border: 'rgba(0, 0, 0, 0.05)',
					ring: '#0071E3'
				}
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '4px'
			},
			boxShadow: {
				'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
				'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
				'strong': '0 8px 30px rgba(0, 0, 0, 0.12)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
