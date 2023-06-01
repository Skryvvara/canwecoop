package services

func RegisterServices() {
	go syncGamesService()
}
