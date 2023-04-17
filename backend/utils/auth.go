package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/skryvvara/canwecoop/config"
)

func GenerateJWT(issuer string) (string, error) {
	expires := time.Now().Add(time.Second * config.APP.Auth.JWTExpiresAt)
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    issuer,
		ExpiresAt: jwt.NewNumericDate(expires),
	})

	return claims.SignedString([]byte(config.APP.Auth.Secret))
}

func ParseJWT(cookie string) (string, error) {
	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.APP.Auth.Secret), nil
	})

	if err != nil || !token.Valid {
		return "", err
	}

	claims := token.Claims.(*jwt.RegisteredClaims)
	return claims.Issuer, nil
}
