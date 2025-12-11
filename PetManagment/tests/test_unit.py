import uuid
from app.domain.entities.pet import Pet, PetType

def test_pet_feed_increases_stats():
    # Arrange
    pet = Pet(
        id=uuid.uuid4(),
        group_id=uuid.uuid4(),
        name="Fluffy",
        type=PetType.DOG,
        hunger_level=50,
        xp=0
    )
    initial_xp = pet.xp
    initial_hunger = pet.hunger_level

    # Act
    pet.feed()

    # Assert
    assert pet.hunger_level == initial_hunger + 20
    assert pet.xp == initial_xp + 10

def test_pet_level_up():
    # Arrange
    pet = Pet(
        id=uuid.uuid4(),
        group_id=uuid.uuid4(),
        name="Rex",
        type=PetType.DOG,
        level=1,
        xp=0
    )
    
    # Act - threshold for level 1 is 50 (1 * 50)
    pet.gain_xp(50)

    # Assert
    assert pet.level == 2
    assert pet.xp == 0


