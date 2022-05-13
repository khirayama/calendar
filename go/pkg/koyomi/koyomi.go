package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"time"
)

var JST, _ = time.LoadLocation("Asia/Tokyo")

type Holiday struct {
	Name  string `json:"name"`
	Year  int    `json:"year"`
	Month int    `json:"month"`
	Date  int    `json:"date"`
}

type NewMoon struct {
	Year  int `json:"year"`
	Month int `json:"month"`
	Date  int `json:"date"`
}

type Term struct {
	Name  string `json:"name"`
	Year  int    `json:"year"`
	Month int    `json:"month"`
	Date  int    `json:"date"`
}

var chukiNames = []string{
	"雨水",
	"春分",
	"穀雨",
	"小満",
	"夏至",
	"大暑",
	"処暑",
	"秋分",
	"霜降",
	"小雪",
	"冬至",
	"大寒",
}

var rokuyoNames = []string{
	"先勝",
	"友引",
	"先負",
	"仏滅",
	"大安",
	"赤口",
}

func LoadJSONFile[T Holiday | NewMoon | Term](year int, fileName string) []T {
	raw, err := ioutil.ReadFile("../../../data/" + strconv.Itoa(year) +"/" + fileName)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	var data []T
	json.Unmarshal(raw, &data)
  return data
}

func main() {
  var terms = LoadJSONFile[Term](2021, "terms.json")
  var newmoons = LoadJSONFile[NewMoon](2021, "newmoons.json")
	fmt.Println(terms)
	fmt.Println(newmoons)
}
