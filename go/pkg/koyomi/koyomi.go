package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
)

type Holiday struct {
	Name  string `json:"name"`
	Year  int    `json:"year"`
	Month int    `json:"month"`
	Date  int    `json:"date"`
}

type NewMoon struct {
	Year  int    `json:"year"`
	Month int    `json:"month"`
	Date  int    `json:"date"`
}

func LoadJSONFile[T Holiday | NewMoon](year int, fileName string) []T {
	raw, err := ioutil.ReadFile("../../../data/" + strconv.Itoa(year) +"/" + fileName)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	var data []T
	json.Unmarshal(raw, &data)
  return data
}

func LoadHolidays(year int) []Holiday {
	raw, err := ioutil.ReadFile("../../../data/" + strconv.Itoa(year) +"/holidays.json")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	var holidays []Holiday
	json.Unmarshal(raw, &holidays)
  return holidays
}

func main() {
  var holidays2022 = LoadHolidays(2022)
	fmt.Println(holidays2022)
  var holidays2023 = LoadHolidays(2023)
	fmt.Println(holidays2023)
  var holidays2021 = LoadJSONFile[Holiday](2021, "holidays.json")
	fmt.Println(holidays2021)
}
