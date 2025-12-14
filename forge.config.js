module.exports = {
    packagerConfig: {
        name: 'Physoft',
        executableName: 'Physoft',
        asar: false, // Disable ASAR for easier debugging
        icon: './electron/assets/icon'
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'Physoft',
                authors: 'Physoft Team',
                description: 'Aplicación de análisis deportivo kinesiológico'
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['win32']
        }
    ],
    plugins: []
};
