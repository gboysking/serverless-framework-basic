import express from 'express';
const app = express();
app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});
export default app;
//# sourceMappingURL=app.js.map