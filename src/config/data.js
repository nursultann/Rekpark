export const dataStore = {
    countryCodes: [
        { code: '996', formatter: '999 99 99 99' },
        { code: '7', formatter: '999 999 99 99' },
        { code: '93', formatter: '99 999 9999' },
        { code: '374', formatter: '99 999 999' },
        { code: '994', formatter: '99 999 99 99' },
        { code: '995', formatter: '999 99 99 99' },
        { code: '992', formatter: '99 999 99 99' },
        { code: '993', formatter: '99 999 999' },
        { code: '998', formatter: '99 999 99 99' },
    ],
    findCountryCode(code) {
        return this.countryCodes.find((c) => c.code === code)
    },
}