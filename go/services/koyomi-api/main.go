package main

import (
	"log"
	"os"
)

type config struct {
	port  string
}

func main() {
  conf := envConfig()

  srv := server.NewServer();
  log.Fatal(srv.Run(conf.port))
}

func envConfig() config {
	port, ok := os.LookupEnv("PORT")

	if !ok {
		panic("PORT not provided")
	}

	return config{port}
}
