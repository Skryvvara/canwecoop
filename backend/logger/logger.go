package logger

import (
	"io"
	"log"
	"os"
	"path"

	"github.com/skryvvara/canwecoop/config"
	"gopkg.in/natefinch/lumberjack.v2"
)

func Initialize() {
	log.Println("Initializing logger...")
	logFile := path.Clean(config.APP.Log.LogFile)

	permissions := os.O_RDWR | os.O_CREATE | os.O_APPEND

	if _, err := os.Stat(path.Dir(logFile)); err != nil {
		if err := os.MkdirAll(path.Dir(logFile), os.ModePerm); err != nil {
			log.Panic(err)
		}
	}

	file, err := os.OpenFile(logFile, permissions, 0644)
	if err != nil {
		log.Panic(err)
	}
	defer file.Close()

	multiWriter := io.MultiWriter(&lumberjack.Logger{
		Filename:   logFile,
		MaxSize:    config.APP.Log.MaxSize,
		MaxBackups: config.APP.Log.MaxBackups,
		MaxAge:     config.APP.Log.MaxAge,
	}, os.Stderr)
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.SetOutput(multiWriter)

	log.Println("Successfully initialized logger. Using log file: " + logFile)
}
