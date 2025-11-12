#!/bin/bash
curl -X POST http://192.168.31.97:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"driver@test.com","password":"password123","name":"Test Driver","role":"driver","phoneNumber":"+1234567890","licenseNumber":"DL001","busNumber":"BUS-101"}'
