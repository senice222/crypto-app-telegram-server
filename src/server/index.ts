import app from "./config/app.config";

const PORT = process.env.APPLICATION_PORT || 5000;

export const setupServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
